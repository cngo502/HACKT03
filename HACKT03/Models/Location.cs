using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HACKT03.Models
{
    public class LocationClass
    {
        public double x { get; set; }
        public double y { get; set; }
        public string Name { get; set; }
        public List<ProductItems> Items { get; set; }
	}

    public class ProductItems
    {
        public string productType { get; set; }
        public int Amount { get; set; }
    }
}