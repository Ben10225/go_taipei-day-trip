package structs

type NewReturn struct {
	Id            string
	Name          string
	Category_name string
	Description   string
	Address       string
	Transport     string
	Mrt_name      string
	Lat           string
	Lng           string
	Urls          string
	Images        []string `gorm:"type:text"`
}

type UserData struct {
	Uuid     string
	Name     string
	Email    string
	Password string
}

type BookingData struct {
	Uuid          string
	Attraction_id string
	Date          string
	Time          string
	Price         int
}

type BookingDetails struct {
	Attraction_id string
	Date          string
	Time          string
	Price         int
	Name          string
	Address       string
	Url           string
	Bid           int
}

type GetBookingData struct {
	Data  BookingDetails
	Date  string
	Time  string
	Price string
}

type TapPayRes struct {
	Status int    `json:"status"`
	Msg    string `json:"msg"`
}
