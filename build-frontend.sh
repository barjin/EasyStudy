#!/bin/bash

npm install --prefix ./frontend
npm run build --prefix ./frontend

cp -r frontend/build/* server/static
cp -r frontend/build/static/* server/static
