# TOOLS 

This folder contains a collection of useful tools to generate and test definition files:
 
- **definition_generator** contains a python script helping to generate a definition file 
 that can be used to define metrics and entities with the integration `nri-prometheus`.
Definition_generator can scrape the output of an exporter and translate it to a definition file. In case the endpoint is not reachable an input file can be used as well.


## Definition Generator - Usage

The only requirement is to have Docker installed and running in the machine where we run the following commands.
In order to automatically generate the definition file clone the repository and cd into the `./definition_generator` folder.
Then we build a Docker image locally, and we use such image as a working environment. The Dockerfile automatically install the required libraries and tools.

``` bash
# Executed in ./tools/definition_generator folder
$ docker build . -t definition_generator
```

Example input:
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

Example output:
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

#### Definition Generator - Generating definition file scraping the prometheus output from an endpoint

Once we built the image correctly we are ready to translate the `/metrics` page exposed by a prometheus endpoint.

We can scrape it directly saving the result to `./definition_generated`
``` bash
$ docker run  definition_generator ./tools.py parse-prometheus -u http://<url>:<port>/metrics > definition_generated
```

The command will output as well the service and the entities found

#### Definition Generator - Generating definition file from a prometheus output saved locally

If for some reason we do not have access to the prometheus endpoint where are you running this commands, you can save locally the output and run the command with the argument`-f --file-path-prometheus` pointing to the mounted file.

``` bash
$ docker run -v /abs/path/to/file:/input_file definition_generator ./tools.py -v parse-prometheus -f /input_file  > definition_generated
```

For example running the command from the `./definition_generator` folder and using the example file provided `./definition_generator/parse_prometheus/sample.prometheus`
``` bash
# Executed in ./definition_generator folder
$ docker run -v $(pwd)/parse_prometheus/sample.prometheus:/input_file definition_generator ./tools.py -v parse-prometheus -f /input_file  > definition_generated
```

#### Definition Generator - Result

No matter which path we followed, but we have locally a definition file `definition_generated`. 
Now we only need to rename it according to the technology monitored, to place it in the proper folder and open
 a PR describing the which was the exporter used to generate the file and its version.
 
Please notice that file integration definition generated for prometheus exporters used by more people are more likely to be accepted and merged.