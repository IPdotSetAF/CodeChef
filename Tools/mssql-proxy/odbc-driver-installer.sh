case $(uname -m) in
    x86_64)   architecture="amd64" ;;
    arm64)   architecture="arm64" ;;
    *) architecture="unsupported" ;;
esac
if [[ "unsupported" == "$architecture" ]];
then
    echo "Alpine architecture $(uname -m) is not currently supported.";
    exit;
fi

echo "apk add --no-cache unixodbc unixodbc-dev curl gnupg"
if ! apk add --no-cache unixodbc unixodbc-dev curl gnupg; then
    echo "Installation of packages failed." >&2
    exit 1
fi
echo "installed unixodbc, unixodbc-dev, curl, gnupg successfully."

echo "installing msodbcsql18..."
#Download the desired package(s)
curl -O https://download.microsoft.com/download/7/6/d/76de322a-d860-4894-9945-f0cc5d6a45f8/msodbcsql18_18.4.1.1-1_$architecture.apk

#(Optional) Verify signature, if 'gpg' is missing install it using 'apk add gnupg':
curl -O https://download.microsoft.com/download/7/6/d/76de322a-d860-4894-9945-f0cc5d6a45f8/msodbcsql18_18.4.1.1-1_$architecture.sig

curl https://packages.microsoft.com/keys/microsoft.asc  | gpg --import -
gpg --verify msodbcsql18_18.4.1.1-1_$architecture.sig msodbcsql18_18.4.1.1-1_$architecture.apk

#Install the package(s)
apk add --allow-untrusted msodbcsql18_18.4.1.1-1_$architecture.apk
sed -i '1s/.*/[SQL Server]/' /etc/odbcinst.ini
echo "installed msodbcsql18 successfully."


