const bot = require('../core/bot');

bot.command("admin", (ctx) => ctx.scene.enter("admin:main"));