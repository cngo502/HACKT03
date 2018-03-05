using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HACKT03.Models
{
	public class SearchClass
	{
		public LocationClass location { get; set; }
		public string name { get; set; }
		public List<ProductItems> items { get; set; }
		public bool pickupcheck { get; set; }
	}

	public class ProductItems
    {
		public bool check { get; set; }
		public string productType { get; set; }
		public int amount { get; set; }
	}
	public class LocationClass
	{
		public double x { get; set; }
		public double y { get; set; }
		public string name { get; set; }
		public double distance { get; set; }

	}
}