/*
	/register
		* request [username,password,avatar]
		* response [ok,message,token]
		* tasks
			* validate username,password,avatar
			* push users array
			* generate token
			* send response

	/login
		* request [username,password]
		* response [ok,message,token]
		* tasks
			* validate username,password
			* find user
			* send response

	/info
		* request []
		* response [users, videos]
		* tasks
			* read users,videos
			* delete users password
			* send response

	/video:name [GET]
		* request[link]
		* response [video]
		* tasks
			* set static videos file 
			* send response

	/video[POST]
		* request[token, video][form data]
		* response[ok,message,video]
		* tasks
			* validate token
			* validate video
			* check is video
			* check video size
			* send response
	
	/video[PUT]
		* request[token,id]
		* response [token, video]
		* tasks
			* validate token
			* validate id
			* send response
	
	/video[DELETE]
		* request [token,videoId]
		* response [ok,message]
		* tasks
			* validate token
			* delete video from json
			* delete video video from files
			* send response

	/search:q=adfasd [GET]
		* request [query]
		* response [ok,message,videos]
		* tasks
			* validate query
			* find name
			* send response 
*/