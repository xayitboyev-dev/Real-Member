const bot = require('../core/bot');

bot.command("admin", async (ctx) => {
   try {
      ctx.scene.enter("admin:main");
   } catch (error) {
      console.log(error);
   };
});