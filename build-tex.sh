#!/bin/bash

set -xueo pipefail

node create-tex-includes.js "$@"
xelatex -synctex=1 -interaction=nonstopmode -halt-on-error cards.tex 

rm cards.{aux,log,synctex.gz}

cp cards.pdf /mnt/c/Users/opens/Downloads
