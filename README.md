# Node Blocs

A bloc is a single loosely coupled container that listens for events then
processes the input from the invoked event and emits the results.

By leveraging the event system, a block can be indirectly invoked and can
easily be swapped or changed out, without having to refactor the entire application.

A blocpkg is a container that can house multiple blocs for a single domain.

## How to use a bloc

All blocs can be invoked using callbacks or promises:

    const { exec } = require('bloc-promise')(bus)

    // exec [type] [payload]
    exec('GEOCODE', { address: '1740 Foo Street', city: 'Racoon City', state: 'NJ', zip: '08057'})
      .then(res => {
        console.log('success', res)
      })
      .catch(err => {
        console.error('error', err)
      })

A bus is any type of event emitter that enables the blocs to listen for events and
emit results. `nanobus` is a good first choice, but you can use any node object
that supports `.on, .once, and .emit` methods:

See https://nodejs.org/api/events.html#events_class_eventemitter for more info

Blocs also have documentation built in them that you can pull dynamically:

   const { docs } = require('bloc-promise')(bus)

   docs('GEOCODE').then(docs => console.log(docs))

You can also get a list of all the blocs registered on a bus.

   const { index } = require('bloc-promise')(bus)

   index().then(blocs => console.log(blocs))


## How to build a bloc and a blocpkg

A blocpkg is a package that manages the shared config of a bloc and registers
the bloc on a bus.

To register a blocpkg on a bus you would do the following:

    const geocodepkg = require('blocpkg-geocode')
    // config would be any keys or basic config needed for your bloc
    // bus would be the bus that this bloc would be registered on
    const { blocs, validate } = geocodepkg.register(config, bus)

By passing the config and the bus in the register step you will get all of the
types returned back, including the docs too if you want them.

The types can be used in your application to not have to pass a string in your exec
function.  

The validatePayload is a function that you can use to get a true or false if your
payload object is valid. For Example,

    const exec = require('bloc-promise')(bus)
    const payload = { address: '1740 Foo Street', city: 'Racoon City', state: 'NJ', zip: '08057'}
    if (validate(blocs.GEOCODE, payload)) {
      result = await exec(blocs.GEOCODE, payload)
    }

Ok, back to how to implement a bloc and blocpkg

Take a look at this example.

    const blocpkg = require('blocpkg')
    module.exports = blocpkg({
      docs: `
# Markdown Document

About the pkg and the blocs

      `,
      blocs: {
        GEOCODE: {
          validate (payload) {

          },
          exec (payload) {

          },
          test (payload) {

          }
        }
      }
    })

---


    const blocpkg = require('blocpkg')

    module.exports = blocpkg({
      docs: fs.readFileSync('./README.md', 'utf-8'),
      blocs: {
        GEOCODE: {
          validate: require('./validate'),
          exec: require('./exec'),
          test: require('./test')
        }
      }
    })