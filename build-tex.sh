#!/bin/bash

set -xueo pipefail

xelatex -synctex=1 -interaction=nonstopmode cards.tex 
cp cards.pdf static/
