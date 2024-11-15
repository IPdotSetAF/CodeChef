import argparse
import pyodbc
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from colorama import Fore, Style, init
import sys

# Initialize colorama
init(autoreset=True)

# Argument parsing for port and allowed origin
parser = argparse.ArgumentParser(description="Run the proxy server with customizable port and allowed origin.")
parser.add_argument("--port", "-p", type=int, default=50505, help="Port to run the server on (default: 50505)")
parser.add_argument("--allowed-origin", "-o", type=str, default="http://localhost:4200", help="Allowed CORS origin (default: http://localhost:4200)")
args = parser.parse_args()

# Initialize FastAPI app
app = FastAPI()

# Set allowed origins
origins = [
    "https://codechef.ipdotsetaf.ir",
    "https://ipdotsetaf.github.ir",
    args.allowed_origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory dictionary to store database connections
connections = {}
connection_index_counter = 1

# Request models
class ConnectRequest(BaseModel):
    server: str
    username: str
    password: str

class QueryRequest(BaseModel):
    connection_id: str
    catalog: str = None
    query: str

class DisconnectRequest(BaseModel):
    connection_id: str

# Function to log connection attempts
def log_connect(index, username, server, connection_id=None, success=True):
    index_text = f"{Fore.YELLOW}[{index}]{Style.RESET_ALL}" if index is not None else ""
    endpoint_text = f"{Fore.GREEN}connect{Style.RESET_ALL}"
    if success:
        print(f"{index_text} {endpoint_text}: {username}@{server}, Connection ID: {connection_id}")
    else:
        print(f"{endpoint_text}: Failed to connect - {username}@{server}")

# Function to log disconnections
def log_disconnect(index, username, server, connection_id):
    index_text = f"{Fore.YELLOW}[{index}]{Style.RESET_ALL}"
    endpoint_text = f"{Fore.GREEN}disconnect{Style.RESET_ALL}"
    print(f"{index_text} {endpoint_text}: {username}@{server}, Connection ID: {connection_id}")

# Function to log executed queries
def log_query(index, query):
    index_text = f"{Fore.YELLOW}[{index}]{Style.RESET_ALL}"
    endpoint_text = f"{Fore.GREEN}execute-query{Style.RESET_ALL}"
    print(f"{index_text} {endpoint_text}: Executed query: {query}")

# Establish a database connection and return a unique connection ID
@app.post("/connect")
async def connect(request: ConnectRequest):
    global connection_index_counter
    try:
        # Attempt to connect to the database
        try: 
            connection = pyodbc.connect(f"Driver={{SQL Server}};Server={request.server};UID={request.username};PWD={request.password};", timeout=5)
        except:
            try:
                base_path = sys._MEIPASS
                connection = pyodbc.connect(f"Driver={base_path}/drivers/msodbcsql18/lib64/libmsodbcsql-18.4.so.1.1;Server={request.server};UID={request.username};PWD={request.password};", timeout=5)
            except:
                raise

        # Generate a unique ID and index for the connection
        connection_id = str(uuid.uuid4())
        index = connection_index_counter
        connection_index_counter += 1

        # Store connection details in the dictionary
        connections[connection_id] = {
            "connection": connection,
            "index": index,
            "username": request.username,
            "server": request.server
        }
        
        # Log successful connection
        log_connect(index, request.username, request.server, connection_id)
        
        return {"status": "connected", "connection_id": connection_id}
    except Exception as e:
        # Log failed connection attempt
        log_connect(None, request.username, request.server, success=False)
        raise HTTPException(status_code=500, detail=f"Failed to connect to database: {e}")

# Execute a SQL query using the specified connection ID
@app.post("/execute-query")
async def execute_query(request: QueryRequest):
    connection_data = connections.get(request.connection_id)
    if not connection_data:
        raise HTTPException(status_code=404, detail="Connection ID not found")
    
    connection = connection_data["connection"]
    index = connection_data["index"]

    try:
        # Execute the query and fetch results
        cursor = connection.cursor()
        if(request.catalog):
            cursor.execute(f"USE {request.catalog}")
            cursor.commit()
        cursor.execute(request.query)
        columns = [column[0] for column in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        # Log executed query
        log_query(index, request.query)
        
        return {"status": "success", "data": rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Disconnect from the database using the specified connection ID
@app.post("/disconnect")
async def disconnect(request: DisconnectRequest):
    connection_data = connections.pop(request.connection_id, None)
    if not connection_data:
        raise HTTPException(status_code=404, detail="Connection ID not found")

    connection = connection_data["connection"]
    index = connection_data["index"]
    username = connection_data["username"]
    server = connection_data["server"]

    try:
        # Close the connection
        connection.close()
        
        # Log disconnection
        log_disconnect(index, username, server, request.connection_id)
        
        return {"status": "disconnected", "connection_id": request.connection_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to disconnect: {e}")

# Run the FastAPI server
if __name__ == "__main__":
    portTxt = f"{Fore.BLUE}{args.port}{Style.RESET_ALL}"
    originTxt = f"{Fore.BLUE}{args.allowed_origin}{Style.RESET_ALL}"
    print(f"Starting server on port {portTxt} with allowed origin: {originTxt}")
    uvicorn.run(app, host="0.0.0.0", port=args.port, access_log=False)