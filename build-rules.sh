#!/bin/bash

set -xeuo pipefail

# apt install pandoc texlive-base texlive-latex-recommended texlive texlive-latex-extra texlive-xetex

export PANDOC=$( which pandoc )
if [ -z "$PANDOC" ]; then
    which docker && { export PANDOC="docker run --rm -v $PWD:/source astralfrontier/pandoc:2.9.2"; }
fi
[ -n "$PANDOC" ] || { echo "No pandoc found!"; exit 1; }

# Usage: runPandoc input-file priority template
function runPandoc() {
    local INPUT=${1}
    local OUTPUT_BASE=${INPUT##*/}
    local OUTPUT=$2/${OUTPUT_BASE%.mdx}.pdf
    local TEMPLATE=${3:-default}
    $PANDOC "$INPUT"                                        \
        -o "$OUTPUT"                                        \
        -M current_date="$(date)"                           \
	    -M git_branch="$(git symbolic-ref --short HEAD)"    \
        --data-dir pandoc                                   \
        --template "$TEMPLATE"                              \
        --lua-filter=filters/standard.lua                   \
        --pdf-engine=xelatex                                \
        -f markdown                                         \
        # 
}

runPandoc src/pages/rules.mdx static default