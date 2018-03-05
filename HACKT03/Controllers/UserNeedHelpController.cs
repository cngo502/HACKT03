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
    public class UserNeedHelpController : Controller
    {
		public ActionResult getUserNeedHelpLocation(string search)
		{
			LocationClass userneedhelp = new LocationClass();
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
				myCommand.CommandText = $"INSERT INTO \"HACKT03\".\"TRANSACTIONS\" VALUES(id_seq_trans.NEXTVAL, {id}, 'PICK' , '{item.productType}', {item.amount}, 'Finished', '')";
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
					userneedhelp.x = double.Parse(myReader["LON"].ToString());
					userneedhelp.y = double.Parse(myReader["LAT"].ToString());
					userneedhelp.name = myReader["FACILITYNAME"]?.ToString();

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
			var data = Content(JsonConvert.SerializeObject(userneedhelp), "application/json", System.Text.Encoding.UTF8);
			return data;
		}
	}
}