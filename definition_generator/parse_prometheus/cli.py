import click

from .prometheus_processor import generate_metrics

@click.command()
@click.option('-f', '--file-path-prometheus', default="./sample.prometheus", type=click.Path(), help="Path to prometheus exporter output.")
@click.option('-u', '--url-prometheus', default="", type=click.Path(), help="URL to prometheus exporter.")
@click.pass_context
def parse_prometheus(ctx, file_path_prometheus, url_prometheus):
    """NR Parse Prometheus check with --help more info. 
    This automation generates a metrics file starting from a prometheus output."""
    yaml = generate_metrics(file_path_prometheus, url_prometheus)
    print(yaml)

