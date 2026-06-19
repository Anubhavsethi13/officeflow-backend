# Error Handling Rules


Standard response:


Success:

{
success:true,
data:{}
}


Failure:

{
success:false,
message:'error'
}



HTTP STATUS:


200 OK

201 CREATED

400 BAD REQUEST

401 UNAUTHORIZED

403 ACCESS DENIED

404 NOT FOUND

500 SERVER ERROR


Use global Express error middleware.
