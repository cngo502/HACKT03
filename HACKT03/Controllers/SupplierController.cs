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
		public ActionResult getSupplierLocation(string search)
		{
			LocationClass supplier = new LocationClass();
			SearchClass current = JsonConvert.DeserializeObject<SearchClass>(search);
            

            //Insert record

            OdbcConnection OdbcConn =
                            new OdbcConnection("Dsn=VHHAL202;uid=HACKT03;pwd=gfZhA7dQ");

            OdbcCommand myCommand = new OdbcCommand();
            myCommand.Connection = OdbcConn;
            OdbcConn.Open();

            string sqlGetUser = "select id as userid from \"HACKT03\".\"USERS\" where NAME = '" + current.name + "'";
            myCommand.CommandText = sqlGetUser;
            string id = "";
            var reader = myCommand.ExecuteReader();
            if (reader.Read())
            {
                //we hvae an existing record
                id = reader["userid"].ToString();
                reader.Close();

            }
            else
            {
                reader.Close();
                //Insert user 
                string sqlInsert = $"insert into \"HACKT03\".\"USERS\" values(id_seq.NEXTVAL, '{current.name}', '', NEW ST_Point('Point ({current.location.x} {current.location.y})', 4326))";
                myCommand.CommandText = sqlInsert;
                myCommand.ExecuteNonQuery();

                sqlGetUser = "select id as userid from \"HACKT03\".\"USERS\" where NAME = '" + current.name + "'";
                myCommand.CommandText = sqlGetUser;
                reader = myCommand.ExecuteReader();
                if (reader.Read())
                {
                    //we hvae an existing record
                    id = reader["userid"].ToString();
                }
                reader.Close();
            }

            foreach (var item in current.items)
            {
                myCommand.CommandText = $"INSERT INTO \"HACKT03\".\"TRANSACTIONS\" VALUES(id_seq_trans.NEXTVAL, {id}, 'DROP' , '{item.productType}', {item.amount}, 'Finished', '')";
                myCommand.ExecuteNonQuery();
            }


            string sql = "SELECT TOP 1 * FROM (select A.NAME AS \"USERNAME\",B.ID AS \"FACILITYID\", B.NAME AS \"FACILITYNAME\" , B.LOCATION.ST_X() AS \"LON\", B.LOCATION.ST_Y() AS \"LAT\", A.LOCATION.ST_Distance(B.LOCATION, 'meter') AS \"DISTANCE\" from \"HACKT03\".\"USERS\" A, \"HACKT03\".\"FACILITIES\" B  where A.NAME = '" + current.name + "') TEMP ORDER BY DISTANCE";
            myCommand.CommandText = sql;
            OdbcDataReader myReader = myCommand.ExecuteReader();
            try
            {

                //Get Neerest Center
                while (myReader.Read())
                {
                    supplier.x = double.Parse(myReader["LON"].ToString());
                    supplier.y = double.Parse(myReader["LAT"].ToString());
					supplier.name = myReader["FACILITYNAME"]?.ToString();
					supplier.distance = Math.Round(0.000621371 * double.Parse(myReader["DISTANCE"].ToString()), 2);

				}
            }
            finally
            {
                myReader.Close();
                OdbcConn.Close();
            }

            //Return it
            //            supplier.x = -95.4805;
            //			supplier.y = 29;
            var data = Content(JsonConvert.SerializeObject(supplier), "application/json", System.Text.Encoding.UTF8);
            return data;
        }


        // GET: Supplier
        public ActionResult getSupplier()
        {
            string sql = "select * from members";
            List<Dictionary<string, string>> returnDatas = new List<Dictionary<string, string>>();
            OdbcConnection myConnection = new OdbcConnection("");
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