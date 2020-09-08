# Definition Generator - Step-by-step tutorial

Follow this tutorial to get started with Definition Generator!

1. [Prerequisites](#Prerequisites)
2. [Build the image](#BuildTheImage)
3. [Generate definition file](#GenerateDefinitionFile)
5. [What's next?](#Whatsnext)

#### Introduction
Definition_generator is a python script helping to generate an `integration definition` file 
 that can be used to define metrics and entities with `nri-prometheus` New Relic integration.
 
It can scrape prometheus metrics and translate it to a definition file. In case the endpoint is not reachable 
can also be used a local file having as content the prometheus output.

Example input file or endpoint:
```
# HELP node_cooling_device_cur_state Current throttle state of the cooling device
# TYPE node_cooling_device_cur_state gauge
node_cooling_device_cur_state{name="0",type="Processor"} 0
node_cooling_device_cur_state{name="1",type="Processor"} 0
# HELP node_cooling_device_max_state Maximum throttle state of the cooling device
# TYPE node_cooling_device_max_state gauge
node_cooling_device_max_state{name="0",type="Processor"} 0
node_cooling_device_max_state{name="1",type="Processor"} 0
[...]
```

Example `integration definition` generated:
```yaml
service: node
display_name: Node
provider: prometheus
entities:
- name: cooling
  metrics:
  - provider_name: node_cooling_device_cur_state
    description: Current throttle state of the cooling device
    type: gauge
    labels:
    - name
    - type
  - provider_name: node_cooling_device_max_state
    description: Maximum throttle state of the cooling device
    type: gauge
    labels:
    - name
    - type
[...]
```



### 1. <a name='Prerequisites'></a> Definition Generator - Prerequisites

You will need to meet the following prerequisites:
 - have Docker installed and running.
 - you need to be able to reach an exporter endpoint (or an application exposing prometheus metrics) from the container, 
 or prometheus metrics saved locally.
 - you should have cloned this repository and being into the `./definition_generator` folder.


### 2. <a name='BuildTheImage'></a> Definition Generator - Build the image

The tool is shipped as a Docker container in order to provide a standardized environment. Docker, when building the image, 
will automatically installs the required libraries and tools.
 
You have to build the Docker image `definition_generator` locally.
``` bash
# Executed in ./definition_generator folder
$ docker build . -t definition_generator
```
You will use such image as a working environment to run the Python command. 

### 3. <a name='GenerateDefinitionFile'></a> Definition Generator - Generate definition file 

It can scrape the output of an endpoint exposing prometheus metrics and translate it to a definition file. In case the endpoint is not reachable an 
input file can be used as well.

#### From prometheus endpoint

Once you have built the image correctly you are ready to translate the `/metrics` page exposed by a prometheus endpoint.

Run the following command in order to scrape such endpoint directly and to save the result to `./definition_generated`
``` bash
$ docker run  definition_generator ./tools.py parse-prometheus -u http://<url>:<port>/metrics > definition_generated
```

#### From a prometheus output saved locally

If for some reason you do not have access to the prometheus endpoint where are you running this commands, you can save 
locally the output and run the command with the argument`-f --file-path-prometheus` pointing to the mounted file.

``` bash
$ docker run -v /abs/path/to/file:/input_file definition_generator ./tools.py -v parse-prometheus -f /input_file  > definition_generated
```

For example running the command from the `./definition_generator` folder and using the example file provided `./definition_generator/parse_prometheus/sample.prometheus`
``` bash
# Executed in ./definition_generator folder
$ docker run -v $(pwd)/parse_prometheus/sample.prometheus:/input_file definition_generator ./tools.py -v parse-prometheus -f /input_file  > definition_generated
```

### 4. <a name='Whatsnext'></a> Definition Generator - What's next?

You have now locally a definition file `definition_generated` with all the metrics associated with the correspondent entities. 

After generating the definition file, since prometheus protocol is quite flexible regarding the naming convention, you should review the generated file.
In some cases you might have to group some entities into a unique one or remove not useful or misleading metrics.

Taking for example the Raven DB exporter definition generated, we can see that many entities can be vague or would contain a metric only, es:

```yaml
service: ravendb
display_name: Ravendb
provider: prometheus
entities:
  - name: is
    metrics:
    - provider_name: ravendb_is_leader
      description: If 1, then node is the cluster leader, otherwise 0
      type: gauge
  - name: mapindex
    metrics:
    - provider_name: ravendb_mapindex_indexed
      description: Server-wide map index indexed count
      type: counter
  - name: mapreduceindex
    metrics:
    - provider_name: ravendb_mapreduceindex_mapped
      description: Server-wide map-reduce index mapped count
      type: counter
```

This can be grouped together under a unique entity `node`

Once reviewed you only need to rename it according to the technology monitored, to place it in the proper folder and open
 a PR describing the which was the exporter used to generate the file and its version.
 
Please notice that file integration definition generated for prometheus exporters used by more people are more likely to
 be accepted and merged.