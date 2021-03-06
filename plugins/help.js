const { Command, commands } = require('commands')
const permissions = require('permissions')

exports.help = (args, player, packet) => {
  const permission = new permissions.Permission('mcjs.command.help')
  if (permission.hasPermission(player.username)) {
    const page = args[0] || 1
    const pages = Math.ceil(commands.length/10)

    if (parseInt(page) > parseInt(pages) || isNaN(parseInt(page))) {
      player.sendMessage({
        text: 'Unknown page.',
        color: 'dark_red'
      })

      return
    }

    function genhelparr() {
      var arr = []

      var commandsarr = JSON.parse(JSON.stringify(commands)) //stringifying and then parsing to keep from modifying commands when splicing
      if (parseInt(page) != 1) {
        commandsarr.splice(0, 10 * page - 10)
      }

      for (var i = 0; i < 10; i++) {
        if (commandsarr[i]) {
          const command = commandsarr[i]

          arr.push([
            {
              text: `/${command.command}`,
              color: 'gold'
            },
            {
              text: `: ${command.info}\n`,
              color: 'white'
            }
          ])
        }
      }

      return arr
    }

    player.sendMessage([
      {
        text: ' --- ',
        color: 'yellow'
      },
      {
        text: 'Help',
        color: 'gold'
      },
      {
        text: ' --- ',
        color: 'yellow'
      },
      {
        text: 'Page ',
        color: 'gold'
      },
      {
        text: `${parseInt(page)}`,
        color: 'red'
      },
      {
        text: '/',
        color: 'gold'
      },
      {
        text: `${pages}`,
        color: 'red'
      },
      {
        text: ' ----\n',
        color: 'yellow'
      },
      genhelparr(),
      checkifnewpage()
    ])

    function checkifnewpage() {
      if (parseInt(page) != parseInt(pages)) {
        return [
          {
            text: 'Type ',
            color: 'gold'
          },
          {
            text: `/help ${parseInt(page) + 1}`,
            color: 'red'
          },
          {
            text: ' to read the next page\n',
            color: 'gold'
          }
        ]
      } else {
        return [
          {
            text: ''
          }
        ]
      }
    }
  } else {
    permissions.defaultError(player._client)
  }
}

exports.init = () => {
  new Command({
    command: 'help',
    filename: 'help.mcjsp',
    info: 'Shows this help page',
    usage: '/help <page?>'
  })
}