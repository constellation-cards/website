#!/bin/bash

gatsby build --prefix-paths && \
  gh-pages -d public -r https://$GH_PAT@github.com/astralfrontier/flip-a-card.git
