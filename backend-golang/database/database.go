package database

import (
	"fmt"
	"log"
	"web/backend-api/config" // import "config"
	"web/backend-api/models" // import "models"

	"gorm.io/driver/mysql" // import "mysql" driver
	"gorm.io/gorm"         // import "gorm"
	// "gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDB() {

	//load konfigurasi database dari .env
	dbUser := config.GetEnv("DB_USER", "root")
	dbPass := config.GetEnv("DB_PASS", "")
	dbHost := config.GetEnv("DB_HOST", "localhost")
	dbPort := config.GetEnv("DB_PORT", "3306")
	dbName := config.GetEnv("DB_NAME", "")

	//Format DSN unuk MySQL
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	//Koneksi ke database
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connected successfully!")

	// Auto migrate models
	err = DB.AutoMigrate(&models.User{}) // Tambahkan model lain jika diperlukan
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	fmt.Println("Database migrated successfully!")

	// db, _ := gorm.Open(mysql.Open(dsn), &gorm.Config{
	// 	Logger: logger.Default.LogMode(logger.Info),
	// })
	
	// db = db.Debug()
	// db.AutoMigrate(&models.User{})
	// fmt.Println(db.Migrator().HasTable(&models.User{}))
}
