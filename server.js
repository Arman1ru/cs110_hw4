'use strict'

	const http = require('http');
	const url = require('url');
	const fs = require('fs');
	const querystring = require('querystring');

	var todoList = [
	{
		id: Math.random() + '',
		message: "Turn on Music",
		checked: false
	},
	{
		id: Math.random() + '',
		message: "Dance",
		checked: false
	},
	{
		id: Math.random() + '',
		message: "Feel Happy",
		checked: false
	}
	]

	const todoServer = http.createServer(function (req, res){

		const parsedUrl = url.parse(req.url);
		const parsedQuery = querystring.parse(parsedUrl.query);
		const method = req.method;

		fs.readFile('./public' + req.url, function(err,data)
		{
			if(err) {
				res.statusCode = 404;
				res.end("The file isn't found")
			}
			else{
				res.statusCode = 200;
				res.end(data);
			}
		});

			//Draw & Search
	if(parsedUrl.pathname.indexOf("/todo")>=0) // If the requests is for todo items
	{
		if(method === 'GET') {
			if(req.url.indexOf('/todo') === 0) {
				res.setHeader('Content-Type', 'application/json');
				let localTodos = todoList;
				if(parsedQuery.searchtext) {
					localTodos = localTodos.filter(function(obj) {
						return obj.message.indexOf(parsedQuery.searchtext) >= 0;
					});
				}
				return res.end(JSON.stringify({items : localTodos}));
			}
		}


			//Add
			if(method === "POST"){
				if(req.url === "/todo")
				{
					let listAdd = '';
					req.on('data',function(junk){
						listAdd = listAdd + junk;
					});

					req.on('end',function(){
						let parsedAdd = JSON.parse(listAdd);
						parsedAdd.id = Math.random() + '';
						todoList.push(parsedAdd);

						res.setHeader('Content-Type','application/json');
						return res.end(JSON.stringify(todoList));
					})
				}
			}

			//Update

			if(method === 'PUT'){
				let listUp = '';
				req.on('data',function(chunk){
					listUp = listUp + chunk;
				});

				req.on('end',function(){
					let parsedUp = JSON.parse(listUp);
					for(let i = 1;i <= todoList.length;i = i +1){
						if(parsedUp.id === todoList[i - 1].id){
							todoList[i-1].checked = parsedUp.checked;
						}
					}
					res.end(JSON.stringify(todoList));
				});
			}

		//Delete
		if(method === 'DELETE'){
			if(req.url.indexOf('/todo/') === 0)
			{
				let id =  req.url.substr(6);
				for(let i = 0; i < todoList.length; i++) {
					if(id === todoList[i].id) {
						todoList.splice(i, 1);
						res.statusCode = 200;
						return res.end('Successfully removed');
					}
				}
				res.statusCode = 404;
				return res.end('Data was not found');
			}
		}
	}
});

	todoServer.listen(9999);