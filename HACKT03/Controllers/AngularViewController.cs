using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HACKT03.Controllers
{
    public class AngularViewController : Controller
    {
		// GET: AngularView
		[OutputCache(NoStore = true, Duration = 0, VaryByParam = "*")]
		public PartialViewResult GetView(string ViewName)
		{
			return PartialView(ViewName);
		}
	}
}