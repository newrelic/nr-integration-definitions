import os
import yaml
import logging
import requests
import re

from prometheus_client.parser import text_string_to_metric_families

RESERVED_NAMESPACE = ["go", "process", "promhttp"]
logger = logging.getLogger()

DEFAULT_UNIT = 'Count'

# These are suffixes. Order matters! First match will be applied.
UNITS_MAPPING = {
    'percent': 'Percent',
    'rate': 'Percent',
    'milliseconds': 'Milliseconds',
    'miliseconds': 'Milliseconds',
    'seconds': 'Seconds',
    'bytes': 'Bytes',
    'bytesPerSecond': 'BytesPerSecond',
    'Ratio': 'Percent', 
    'kb': 'Kilobytes',
    'kbps': 'KilobytesPerSecond',
    'latency': 'Milliseconds',
    'latencies': 'Milliseconds',
    r'(network|write|read)[a-z]*throughput': 'BytesPerSecond',
    'throughput': 'CountPerSecond',
    'bytesps': 'BytesPerSecond',
    'countps': 'CountPerSecond',
    'uptime': 'Seconds', 
}

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
        metricDict = getMetricDict(family)
        for metricObj in metricDict.values():
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
    serviceObj["provider"] = "prometheus"
    serviceObj["service"]=serviceName
    serviceObj["display_name"]=capitalise(serviceName)
    serviceObj["entities"]=[]
    return serviceObj
  
# Returns already existing entity or a new one
def getEntityObj(serviceObj, entityName):
    for e in serviceObj["entities"]:
        if e["name"] == entityName:
            return e
    e={}
    e["name"]= entityName
    e["metrics"]=[]
    serviceObj["entities"].append(e)
    return e

# Returns transformed family into metric
def getMetricDict(family):
    metricAdded = {}
    
    for s in family.samples:
        
        sampleName = s[0]
        sampleLabels = s[1]
        if sampleName in metricAdded.keys():
            continue

        m={}
        m["provider_name"] = sampleName
        m["description"] = family.documentation
        m["type"] = family.type
        m["unit"] = get_metric_unit(sampleName)
        if len(family.samples) == 0:
            return m

        labels = []
        for l in sampleLabels.keys():
            labels.append(l)
        if len(labels) > 0:
            m["labels"] = labels 
        
        metricAdded[sampleName] = m

    return metricAdded

def get_metric_unit(metricName):
    '''
    Try to determine unit from metric name based on the list of base units.
    Return None if it cannot be determined.
    '''
    for unit in UNITS_MAPPING.keys():
        # if re.compile(unit.lower()+"$").search(metricName.lower()):
        if re.compile("_" + unit.lower() + "_").search(metricName.lower()):
            return UNITS_MAPPING[unit]

    return DEFAULT_UNIT