#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-
export INVOKED_AS="$0"
exec nodemjs "$(readlink -m -- "$BASH_SOURCE"/..)/cli.mjs" "$@"; exit $?
