package db

import (
	"log"
	"strconv"
	"taipei-day-trip/structs"
)

func SelectAttractions(page, keyword string) ([]structs.NewReturn, bool) {
	db := Db
	// 確認是用同一個 pool，沒有多開
	// fmt.Println(db)

	startIndex, _ := strconv.Atoi(page)
	startIndex *= 12
	var items []structs.NewReturn
	if keyword == "" {
		err := db.Table("attractions AS a").Select("a.id, a.name, c.category_name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng, GROUP_CONCAT( DISTINCT i.url ORDER BY i.pid ASC SEPARATOR ',') AS urls").Joins("JOIN categories AS c ON a.category_id = c.cid").Joins("JOIN mrts AS m ON a.mrt_id = m.mid").Joins("JOIN images AS i ON i.iid = a.id").Group("a.id, c.category_name, a.name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng").Order("a.aid").Limit(13).Offset(startIndex).Find(&items).Error
		// err := db.Table("attractions").Limit(13).Offset(startIndex).Find(&items).Error
		if err != nil {
			return nil, false
		}
	} else {
		err := db.Table("attractions AS a").Select("a.id, a.name, c.category_name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng, GROUP_CONCAT( DISTINCT i.url ORDER BY i.pid ASC SEPARATOR ',') AS urls").Joins("JOIN categories AS c ON a.category_id = c.cid").Joins("JOIN mrts AS m ON a.mrt_id = m.mid").Joins("JOIN images AS i ON i.iid = a.id").Where("a.name Like ? OR c.category_name=?", "%"+keyword+"%", keyword).Group("a.id, c.category_name, a.name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng").Order("a.aid").Limit(13).Offset(startIndex).Find(&items).Error
		// err := db.Table("attractions").Where("name Like ? OR category=?", "%"+keyword+"%", keyword).Limit(13).Offset(startIndex).Find(&items).Error
		if err != nil {
			return nil, false
		}
	}
	if len(items) == 13 {
		return items[:len(items)-1], true
	} else {
		return items, false
	}
}

func SelectAttractionById(id int) *structs.NewReturn {
	db := Db
	var attraction structs.NewReturn

	err := db.Table("attractions AS a").Select("a.id, a.name, c.category_name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng, GROUP_CONCAT( DISTINCT i.url ORDER BY i.pid ASC SEPARATOR ',') AS urls").Joins("JOIN categories AS c ON a.category_id = c.cid").Joins("JOIN mrts AS m ON a.mrt_id = m.mid").Joins("JOIN images AS i ON i.iid = a.id").Where("a.id=?", id).Group("a.id, c.category_name, a.name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng").First(&attraction).Error
	// err := db.Raw("SELECT a.id, c.category_name, a.name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng, GROUP_CONCAT( DISTINCT i.url ORDER BY i.pid ASC SEPARATOR ',') AS urls FROM attractions AS a INNER JOIN categories AS c ON a.category_id=c.cid INNER JOIN mrts AS m ON a.mrt_id=m.mid INNER JOIN images AS i ON a.id=i.iid WHERE a.id=? GROUP BY a.id, c.category_name, a.name, a.description, a.address, a.transport, m.mrt_name, a.lat, a.lng", id).First(&attraction).Error
	if err != nil {
		return nil
	}
	return &attraction
}

func SelectCategories() []string {
	db := Db
	var cateLst []string
	err := db.Table("categories").Select("category_name").Find(&cateLst).Error
	if err != nil {
		return nil
	}
	return cateLst
}

func CheckAndInsertUser(uuid, name, email, password string) bool {
	db := Db
	var user structs.UserData
	err := db.Table("users").Where("email = ?", email).First(&user).Error
	if err != nil {
		log.Println(err)
		user = structs.UserData{Uuid: uuid, Name: name, Email: email, Password: password}
		err = db.Table("users").Create(&user).Error
		if err != nil {
			log.Println(err)
		}
		return true
	}
	return false
}

func GetUserByEmail(email string) (*structs.UserData, bool) {
	db := Db
	var user structs.UserData
	err := db.Table("users").Select("uuid, name, email, password").Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, false
	}
	return &user, true
}

func CheckAndInsertBooking(uuid, attractionId, date, time string, price int, status string) string {
	db := Db
	var booking structs.BookingData

	if status == "push" {
		insertInfo := structs.BookingData{Uuid: uuid, Attraction_id: attractionId, Date: date, Time: time, Price: price}
		err := db.Table("bookings").Create(&insertInfo).Error
		if err != nil {
			log.Println(err)
		}
		return "行程建立成功"
	}

	err := db.Table("bookings").Where("uuid=? and date=? and time=?", uuid, date, time).First(&booking).Error
	if err != nil {
		insertInfo := structs.BookingData{Uuid: uuid, Attraction_id: attractionId, Date: date, Time: time, Price: price}
		db.Table("bookings").Create(&insertInfo)
		if err != nil {
			log.Println(err)
		}
		return "行程建立成功"
	}
	return "此行程已存在"
}

func GetBookings(uuid string) []structs.BookingDetails {
	db := Db
	var bookingRetails []structs.BookingDetails
	err := db.Table("bookings As b").Select("b.bid, b.attraction_id, b.date, b.time, b.price, a.name, a.address, i.url").Joins("JOIN attractions AS a ON b.attraction_id=a.id").Joins("JOIN images AS i ON b.attraction_id=i.iid").Where("b.uuid=?", uuid).Group("b.bid").Order("b.bid").Find(&bookingRetails).Error
	if err != nil {
		log.Println(err)
	}
	return bookingRetails
}

func DeleteBooking(bid []int, s string) bool {
	db := Db
	var booking structs.BookingData
	if s == "one" {
		err := db.Table("bookings").Where("bid=?", bid[0]).Delete(&booking).Error
		if err != nil {
			log.Fatal(err)
			return false
		}
	} else if s == "multiple" {
		err := db.Table("bookings").Where("bid in ?", bid).Delete(&booking).Error
		if err != nil {
			log.Fatal(err)
			return false
		}
	}
	return true
}

func Get_user_info_by_uuid(uuid string) []string {
	db := Db
	var userNameEmail struct {
		Name  string
		Email string
	}
	err := db.Table("users As u").Select("u.name, u.email").Where("uuid=?", uuid).First(&userNameEmail).Error
	if err != nil {
		return nil
	}
	result := []string{userNameEmail.Name, userNameEmail.Email}
	return result
}

func CreatePayment(orderNumber, uuid string, totalPrice int, contactName, contactEmail, contactPhone string, status bool) int {
	db := Db
	insertPayment := structs.Payment{
		Order_number:  orderNumber,
		Uuid:          uuid,
		Total_price:   totalPrice,
		Contact_name:  contactName,
		Contact_email: contactEmail,
		Contact_phone: contactPhone,
		Status:        status,
	}
	err := db.Table("payment").Create(&insertPayment).Error
	if err != nil {
		log.Println(err)
	}
	var paymentId int
	err = db.Table("payment").Select("LAST_INSERT_ID(payment_id)").Order("LAST_INSERT_ID(payment_id) DESC").Limit(1).Find(&paymentId).Error
	// db.Raw("SELECT LAST_INSERT_ID(payment_id) from payment order by LAST_INSERT_ID(payment_id) DESC LIMIT 1").Scan(&paymentId)
	if err != nil {
		log.Println(err)
	}
	return paymentId
}

func CreateTrips(paymentId int, orderNumber string, trips []structs.Orders_trips) {
	db := Db

	for _, trip := range trips {
		attrPrice, _ := strconv.Atoi(trip.Attraction.Price)
		insertTrips := structs.Trips{
			Tid:                paymentId,
			Trip_order_number:  orderNumber,
			Attraction_id:      trip.Attraction.Id,
			Attraction_name:    trip.Attraction.Name,
			Attraction_address: trip.Attraction.Address,
			Attraction_image:   trip.Attraction.Image,
			Attraction_price:   attrPrice,
			Attraction_date:    trip.Date,
			Attraction_time:    trip.Time,
		}
		err := db.Table("trips").Create(&insertTrips).Error
		if err != nil {
			log.Println(err)
		}
	}
}

func GetUserOrders(uuid string) []structs.GetPayment {
	db := Db
	var payments []structs.GetPayment
	err := db.Table("payment").Select("payment_id, order_number, total_price, contact_name, contact_email, contact_phone, time").Where("uuid=?", uuid).Group("payment_id").Order("payment_id DESC").Find(&payments).Error
	if err != nil {
		log.Println(err)
		return nil
	}
	return payments
}

func GetUserOrdersAttraction(tid int, tnum string) []structs.Trips {
	db := Db
	var attractionInfos []structs.Trips
	err := db.Table("trips").Select("attraction_name, attraction_address, attraction_image, attraction_price ,attraction_date, attraction_time").Where("tid=? AND trip_order_number=?", tid, tnum).Order("tid DESC").Find(&attractionInfos).Error
	if err != nil {
		log.Println(err)
		return nil
	}
	return attractionInfos
}

func UpdateUserName(uuid, name string) bool {
	db := Db

	err := db.Table("users").Where("uuid=?", uuid).Update("name", name).Error
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}
