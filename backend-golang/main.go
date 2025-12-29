package main

import (
	"web/backend-api/config"
	"web/backend-api/database"
	"web/backend-api/routes"
)

func main() {
	//load config .env
	config.LoadEnv()

	//inisialisasi database
	database.InitDB()

	//setup router
	r := routes.SetupRouter()

	// membuat route dengan method GET
	// r.GET("/", func(c *gin.Context) {

	// 	//return response JSON
	// 	c.JSON(200, gin.H{
	// 		"message": "Hello World!",
	// 	})
	// })

	//mulai server dengan port 3000
	r.Run(":" + config.GetEnv("APP_PORT", "3000"))
}
