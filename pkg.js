module.exports = blocpkg => {
  return Object.freeze({
    register(config, bus) {
      mapObj(createListener(config, bus), blocpkg.blocs)
      return {
        blocs: Object.keys(blocpkg.blocs).reduce((acc, v) => {
          acc[v] = v
          return acc
        }, {}),
        docs: blocpkg.docs
      }
    }
  })
}

function createListener(config, bus) {
  return function(bloc, blockType) {
    bus.on(blockType, payload => {
      const target = payload.target
      const rest = omit(['target'], payload)
      // validate payload
      const validCheck = bloc.validate(rest)
      if (validCheck.ok) {
        // invoke bloc
        bloc
          .exec(config, rest)
          .then(res => bus.emit(target, Object.assign(res, { ok: true })))
          .catch(err => bus.emit(target, Object.assign(err, { ok: true })))
      } else {
        bus.emit(target, validCheck)
      }
    })
  }
}

function mapObj(fn, o) {
  return Object.keys(o).map(key => fn(o[key], key))
}

function omit(keys, o) {
  let objectKeys = Object.keys(o)
  objectKeys = objectKeys.filter(key => !~keys.indexOf(key))
  return objectKeys.reduce((acc, v) => {
    acc[v] = o[v]
    return acc
  }, {})
}
