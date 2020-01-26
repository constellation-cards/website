#!/bin/bash

set -xueo pipefail

pushd template
xelatex -synctex=1 -interaction=nonstopmode cards.tex 
popd
cp template/cards.pdf static/