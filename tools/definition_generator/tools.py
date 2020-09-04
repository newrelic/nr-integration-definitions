#!/usr/bin/env python3

import click
import logging
import sys

from parse_prometheus.cli import parse_prometheus

logger = logging.getLogger()

def set_output_level(verbose):
    if verbose:
        logger.setLevel(logging.INFO)
        logger.handlers = []
        handler = logging.StreamHandler(sys.stderr)
        handler.setLevel(logging.INFO)
        formatter = logging.Formatter("%(asctime)s - %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)

@click.group(chain=True)
@click.option('-v', '--verbose', is_flag=True, help="Increases the output verbosity")
@click.pass_context
def main(ctx, verbose):
    """This tool automates some processes related to the simple Integrations release. 
    """
    set_output_level(verbose)

    ctx.obj = {
        'verbose': verbose
    }

main.add_command(parse_prometheus)

main()