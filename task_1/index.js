import {encoded, translations} from './data.js'

function decoded() {
  const translationsKeys = Object.keys(translations);
  const exceptions = ["groupId", "service", "formatSize", "ca"];
  const ignoredId = [];
  const uniqueId = {};

  encoded.forEach(item => {

    for(let key in item) {
      if(exceptions.includes(key)) {
        continue;
      }

      if(translationsKeys.includes(item[key])) {
        if(!uniqueId[item[key]] && !ignoredId.includes(item[key])) {
          uniqueId[item[key]] = 1;
        } else if(uniqueId[item[key]]) {
          delete uniqueId[item[key]]
          ignoredId.push(item[key])
        }

        item[key] = translations[item[key]]
      }
    }
  });

  return {
    encoded,
    uniqueId: Object.keys(uniqueId),
  }
}

console.log("Let's rock")
console.log(encoded, translations)
console.log(decoded())
