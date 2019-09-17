const fs = require('fs')
const axios = require('axios')
const argv = require('minimist')(process.argv.slice(2))

// Command line arguments
const user = argv.u || argv.user
const path = argv.d || './data'
const file = argv.f || user
const raw = argv.raw || false

if (user === undefined) {
  console.error('Missing user argument: -u <username>')
  process.exit(1)
}

// match this pattern to filter raw JSON data
const regex = /<script type="text\/javascript">window\._sharedData = (.*)<\/script>/

/**
 * Get Instagram data for given user
 *
 * @param  {String} user Instagram user name
 * @return {Array}
 */
const instagramData = async (user) => {
  const requests = []
  const result = []

  try {
    const { data } = await axios.get(`https://www.instagram.com/${user}/`)
    const userInfo = JSON.parse(data.match(regex)[1].slice(0, -1))

    raw && result.push(userInfo)

    const mediaArray = userInfo.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
    mediaArray.forEach(({ node }) => {
      requests.push(axios.get(`https://www.instagram.com/p/${node.shortcode}/`))
    })

    // Get individual posts by shortcode
    const response = await Promise.all(requests)
    const mediaMap = response.reduce((map, res) => {
      const jsonObject = JSON.parse(res.data.match(regex)[1].slice(0, -1))
      raw && result.push(jsonObject)
      const media = jsonObject.entry_data.PostPage[0].graphql.shortcode_media
      map[media.shortcode] = media
      return map
    }, {})

    if (!raw) {
      // Merge posts with profile data
      mediaArray.forEach(({ node }) => {
        result.push({ ...node, ...mediaMap[node.shortcode] })
      })
    }
  } catch (e) {
    console.error(`Unable to get data. Reason: ${e.toString()}`)
    process.exit(1)
  }

  return result
}

/**
 * Run main script
 */
const run = async () => {
  console.time(`Saved profile ${path}/${user}.json`)
  const output = await instagramData(user)
  fs.writeFileSync(`${path}/${file}.json`, JSON.stringify(output, null, 2))
  console.timeEnd(`Saved profile ${path}/${user}.json`)
}

run()
