using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HACKT03.Models
{
	public class SearchClass
	{
		public LocationClass location { get; set; }
		public string organization { get; set; }
		public List<Supplier> items { get; set; }
	}

	public class Supplier
	{
		public bool check { get; set; }
		public string product { get; set; }
		public int numOfItem { get; set; }
	}
	public class LocationClass
	{
		public double x { get; set; }
		public double y { get; set; }

	}
}