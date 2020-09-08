import os
import yaml
import logging
import requests

from prometheus_client.parser import text_string_to_metric_families

RESERVED_NAMESPACE = ["go", "process", "promhttp"]
logger = logging.getLogger()


def generate_metrics(prometheus_output_path, url_prometheus):

    if url_prometheus != "" :
        logger.info("Scraping url: %s", url_prometheus)
        resp = requests.get(url_prometheus)
        metrics = resp.text
    else :
        logger.info("Reading file: %s", prometheus_output_path)
        # Reading prometheus output from file
        file = open(prometheus_output_path,mode='r')    
        metrics = file.read()
        file.close()

    output={}
    for family in text_string_to_metric_families(metrics):

        serviceName = family.name.split("_")[0]
        entityName = family.name.split("_")[1]

        if serviceName in RESERVED_NAMESPACE:
            continue

        serviceObj = getServiceObj(output, serviceName)
        entityObj = getEntityObj(serviceObj, entityName)
        metricObj = getMetricObj(family)
        entityObj["metrics"].append(metricObj)

    stringFile = ""
    for val in output.values():
        yaml_file = yaml.dump(val, default_flow_style=False, sort_keys=False)    
        stringFile = stringFile + yaml_file + "---\n"

    logger.info("Parsed the whole output")
    return stringFile
    


def capitalise(str):
    return str[0].upper() + str[1:]

# Returns already existing serviceObj or a new one
def getServiceObj(output, serviceName):
    if serviceName in output:
        return output[serviceName]
    logger.info("New service found: %s", serviceName)
    serviceObj={}
    output[serviceName] = serviceObj
    serviceObj["service"]=serviceName
    serviceObj["display_name"]=capitalise(serviceName)
    serviceObj["entities"]=[]
    return serviceObj
  
# Returns already existing entity or a new one
def getEntityObj(serviceObj, entityName):
    for e in serviceObj["entities"]:
        if e["name"] == entityName:
            return e
    logger.info("New entity found: %s for the service: %s", entityName, serviceObj["service"])
    e={}
    e["name"]= entityName
    e["metrics"]=[]
    serviceObj["entities"].append(e)
    return e

# Returns transformed family into metric
def getMetricObj(family):
    m={}
    m["provider_name"] = family.name
    m["description"] = family.documentation
    m["type"] = family.type
    if len(family.samples) == 0:
        return m

    labels = []
    for l in family.samples[0].labels.keys():
        labels.append(l)
    if len(labels) > 0:
        m["labels"] = labels 
    
    return m