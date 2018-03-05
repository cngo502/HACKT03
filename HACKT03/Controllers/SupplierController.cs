using HACKT03.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HACKT03.Controllers
{
    public class SupplierController : Controller
    {
		private static string _ConnectionString = "DRIVER={MySQL ODBC 3.51 Driver}; SERVER=VHHAL20264; PORT=3306;" + 
													"DATABASE=hack03; USER=HACKT03; PASSWORD=gfZhA7dQ; OPTION=0;";

		public ActionResult getSupplierLocation(string currentLocation)
		{
			LocationClass supplier = new LocationClass();
			LocationClass current = JsonConvert.DeserializeObject<LocationClass>(currentLocation);

            //Insert record

            //Get Neerest Center

            //Return it
			supplier.x = -95.4805;
			supplier.y = 29;
			var data = Content(JsonConvert.SerializeObject(supplier), "application/json", System.Text.Encoding.UTF8);
			return data;
		}


        // GET: Supplier
        public ActionResult getSupplier()
        {
			string sql = "select * from members";
			List<Dictionary<string, string>> returnDatas = new List<Dictionary<string, string>>();
			OdbcConnection myConnection = new OdbcConnection(_ConnectionString);
			OdbcCommand myCommand = new OdbcCommand(sql, myConnection);
			myConnection.Open();
			OdbcDataReader myReader = myCommand.ExecuteReader();
			try
			{
				while (myReader.Read())
				{
					Dictionary<string, string> temp = new Dictionary<string, string>();
					temp.Add("NAME", myReader["NAME"]?.ToString());
				}
			}
			finally
			{
				myReader.Close();
				myConnection.Close();
			}
			var data = Content(JsonConvert.SerializeObject(returnDatas), "application/json", System.Text.Encoding.UTF8);
			return data;
		}
    }
}