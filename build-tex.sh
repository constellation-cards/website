#!/bin/bash

set -xueo pipefail

node create-tex-includes.js
xelatex -synctex=1 -interaction=nonstopmode cards.tex 
sh ./cleanup-cards.sh

rm allcards.tex cards.{aux,log,synctex.gz}
