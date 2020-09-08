# Integration definition files schema

The integration definition files are used by nri-prometheus to group metrics into entities, and also is used by the automation tools to generate dashboards and documentation. They are written in YAML with the following specifications:

## File name format:

Prometheus integration definition files should have the following format:

`prometheus_<EXPORTER_NAME>.yml`

e.g.:

`prometheus_ravendb.yml`

## Schema Definition:
```yaml
# Monitored service name, must match with the metrics prefix of the exporter (e.g. redis_commands_duration_seconds_total)
# Example "ravendb", "redis", "node"
service: string, required 

# Monitored service display name. This name will be shown in the Infrastructure UI page.
display_name: string, required

# Name of the default entity. If defined, metrics that match the service prefix but are not defined in any entity will be added to this entity.
# The default entity needs to be defined in the entities list.
default_entity: string, non-required

# List of entities that you want to monitor. Sometimes there is just one entity, which is the service itself,
# Example: `Redis` service has just an `Instance`.
# However, sometimes one service can have multiple entities that have different names.
# Example: `RavenDb` service that has the following entities: `Database`, `Node`.
entities: # Non empty list of Entity definition, required
    #First entity Name. This name is used to form the entity type prefixed by the service e.g. RavendbDatabase
  - name: string, required 
    # List of properties 
    properties: non-required
      # Array of metric labels that will be part of the entity name.
      # If dimension has been specified for the entity, all metrics in the entity need to contain this labels.
      # Values of the labels will be concatenated in the entity name using ':'. They will follow the order of the list.
      # Example: [dim1, dim2] the entity will add 'dim1value:dim2value' to the name
      dimensions: list, non-required
    # List of metrics for this entity
    metrics: # Non empty list of metric definitions, required
        # name of the metric as is present in the exporter
      - provider_name: string, required
        # Text with a description for the metric. Usually present in the exporter output commented using # HELP
        description: string, required 
        # Usually present in the exporter output commented using # TYPE
        type: Counter | Gauge | Summary | Histogram # default?
        # list of labels that the metric has e.g. [label1, label2, label3]
        labels: list, non-required
```
