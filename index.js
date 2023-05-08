#!/usr/bin/env node

const Service = require('./service/config/Service')
const service = new Service()

service.start()
