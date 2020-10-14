# Integration definition files schema

The integration definition files are used by the Prometheus integration to group metrics into entities, and they are also used by the automation tools to generate dashboards and documentation.

Integration definition files are written in YAML with the following specifications:

## Filename format

Prometheus integration definition files should have the following format:

`prometheus_<SERVICE_NAME>.yml`

For example:

`prometheus_ravendb.yml`

## Schema definition

```yaml
# Monitored service name, must match with the metrics prefix of the exporter (e.g. redis_commands_duration_seconds_total)
# Examples: "ravendb", "redis", "node"
service: string, required

# Name of the monitored service. This name will be shown in the Infrastructure UI page.
display_name: string, required

# Name of the default entity. If defined, metrics that match the service prefix but are not defined in any entity will be added to this entity.
# The default entity needs to be defined in the entities list.
default_entity: string, optional

# List of entities you want to monitor. There may be just one entity, which could be the service itself,
# for example the `Redis` service has just one `Instance`.
# In some cases, one service can hold multiple entities under different names.
# Example: The `RavenDb` service has the following entities: `Database`, `Node`.
entities: # Non-empty list of entity definitions. Required.
    # First entity Name. Used to form the entity type prefixed by the service (for example, `RavendbDatabase`).
  - name: string, required
    # List of properties
    properties: optional
      # Array of metric labels that will be used to generate the entity name.
      # If a label has been specified for the entity, all metrics in the entity must contain these labels.
      # Values of the labels will be concatenated to the entity name using ':' following the order in the list.
      # Example: Given [dim1, dim2] the entity will concatenate 'dim1value:dim2value' to the name.
      labels: list, optional
    # List of metrics for this entity
    metrics: # Non-empty list of metric definitions. Required.
        # Name of the metric as is present in the exporter.
      - provider_name: string, required
        # Description of the metric. In the exporter output, it appears commented using `# HELP`.
        description: string, required
        # Type of metric. In the exporter output, it appears commented using # TYPE.
        type: counter | gauge | summary | histogram
        # Unit that the metric value represents, it is usually specified at the last part of the name.
        # For example ravendb_database_size_bytes will be "bytes". 
        # Full list can be found here https://github.com/newrelic/nr-integration-definitions/blob/main/validator/schema-v1.json#L77
        unit: Count | Percent | Seconds | Milliseconds | Bytes | BytesPerSecond | Kilobytes | ... 
        # list of labels that the metric has e.g. [label1, label2, label3]
        labels: list, optional
```
