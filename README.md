# Parflow hydrologic model
This is a simput model for the [parflow simulation system](https://parflow.org/).
# Build Process 
```
# Checkout parflow model generator
git clone https://github.com/DrewLazzeriKitware/parflow.git
cd parflow
git checkout dev
cd ..

# Generate model.json input for Simput from our parflow generator 
# You may need to install some dependencies
python parflow/pf-keys/generators/simput_model.py \
  -d parflow/pf-keys/definitions \
  -o src/

# Generate parflow.js output from Simput for our application
Simput compile -c src -o versions -t parflow
```
