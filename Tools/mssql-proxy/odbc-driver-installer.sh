# Detect architecture
case $(uname -m) in
    x86_64)   architecture="amd64" ;;
    arm64)    architecture="arm64" ;;
    aarch64)  architecture="arm64" ;;
    *)        architecture="unsupported" ;;
esac
if [[ "unsupported" == "$architecture" ]]; then
    echo "Architecture $(uname -m) is not currently supported."
    exit 1
fi

# Detect OS
if [ -f /etc/alpine-release ]; then
    os="alpine"
elif [ -f /etc/lsb-release ]; then
    os="ubuntu"
else
    echo "Unsupported operating system."
    exit 1
fi

# Install dependencies based on OS
if [ "$os" == "alpine" ]; then
    echo "Installing packages for Alpine Linux..."
    if ! apk add --no-cache unixodbc unixodbc-dev curl gnupg; then
        echo "Installation of packages failed on Alpine." >&2
        exit 1
    fi
elif [ "$os" == "ubuntu" ]; then
    echo "Installing packages for Ubuntu..."
    if ! sudo apt-get update || ! sudo apt-get install -y unixodbc unixodbc-dev curl gnupg; then
        echo "Installation of packages failed on Ubuntu." >&2
        exit 1
    fi
else
    echo "Unknown error occurred during OS detection."
    exit 1
fi
echo "Installed dependencies successfully."

# Install msodbcsql18
echo "Installing msodbcsql18..."
if [ "$os" == "alpine" ]; then
    # Download package for Alpine
    curl -O https://download.microsoft.com/download/7/6/d/76de322a-d860-4894-9945-f0cc5d6a45f8/msodbcsql18_18.4.1.1-1_$architecture.apk
    curl -O https://download.microsoft.com/download/7/6/d/76de322a-d860-4894-9945-f0cc5d6a45f8/msodbcsql18_18.4.1.1-1_$architecture.sig
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --import -
    gpg --verify msodbcsql18_18.4.1.1-1_$architecture.sig msodbcsql18_18.4.1.1-1_$architecture.apk
    apk add --allow-untrusted msodbcsql18_18.4.1.1-1_$architecture.apk
elif [ "$os" == "ubuntu" ]; then
    # Add Microsoft repository
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
    curl https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/prod.list > /etc/apt/sources.list.d/mssql-release.list
    apt-get update
    ACCEPT_EULA=Y sudo apt-get install -y msodbcsql18
else
    echo "Failed to handle msodbcsql18 installation for $os."
    exit 1
fi