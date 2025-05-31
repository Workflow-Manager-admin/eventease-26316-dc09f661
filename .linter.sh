#!/bin/bash
cd /home/kavia/workspace/code-generation/eventease-26316-dc09f661/eventease
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

