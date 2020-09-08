const process = require('process')
const utils = require('./utils')

var ENTITY_NAMES
var METRIC_NAMES

const RULES = [
  {
    name: 'Entity names are unique',
    apply: entity => {
      if (ENTITY_NAMES.has(entity.name)) {
        throw `Entity ${entity.name} is duplicated.`
      }

      ENTITY_NAMES.add(entity.name)
    }
  },
  {
    name: 'Metric names are unique',
    apply: entity => {
      entity.metrics.forEach(metric => {
        if (METRIC_NAMES.has(metric.provider_name)) {
          throw `Metric ${metric.provider_name} is duplicated.`
        }

        METRIC_NAMES.add(metric.provider_name)
      })
    }
  }
]

utils.getAllDefinitions().forEach(def => {
  ENTITY_NAMES = new Set()
  def.entities.forEach(entity => {
    METRIC_NAMES = new Set()
    RULES.forEach(rule => {
      try {
        rule.apply(entity)
      } catch (errorMessage) {
        console.error(`Spec for ${def.service} violates rule "${rule.name}":`)
        console.error(errorMessage)

        process.exit(1)
      }
    })
  })
})
