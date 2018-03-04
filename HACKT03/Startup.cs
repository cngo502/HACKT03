using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(HACKT03.Startup))]
namespace HACKT03
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
