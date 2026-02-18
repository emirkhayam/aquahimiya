#!/bin/bash

# SSH connection details
HOST="37.60.235.208"
USER="root"
PASSWORD="26211810Emir"

# Check system info
echo "Checking system information..."
ssh -o StrictHostKeyChecking=no ${USER}@${HOST} << 'EOF'
uname -a
cat /etc/os-release

echo "Installing dependencies..."
# Update package list
apt-get update || yum update -y

# Install git and build tools
apt-get install -y git build-essential cmake || yum install -y git gcc-c++ cmake make

# Install OpenClaw dependencies
apt-get install -y libsdl2-dev libsdl2-mixer-dev libsdl2-image-dev libsdl2-ttf-dev libtinyxml-dev zlib1g-dev || \
yum install -y SDL2-devel SDL2_mixer-devel SDL2_image-devel SDL2_ttf-devel tinyxml-devel zlib-devel

echo "Cloning OpenClaw repository..."
cd /root
git clone https://github.com/openclaw/openclaw.git
cd openclaw

echo "Building OpenClaw..."
mkdir -p build
cd build
cmake ..
make

echo "Installation complete!"
EOF
