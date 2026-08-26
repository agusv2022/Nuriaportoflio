#!/usr/bin/env bash
# Valida .pages.yml con las MISMAS librerías que usa Pages CMS (js-yaml).
# El validador de Python acepta claves duplicadas; js-yaml no.
node -e "
const yaml=require('js-yaml'),fs=require('fs');
try{ yaml.load(fs.readFileSync('.pages.yml','utf8')); console.log('YAML válido'); }
catch(e){ console.error('YAML INVÁLIDO:', e.message); process.exit(1); }
"
