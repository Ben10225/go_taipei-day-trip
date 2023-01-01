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

type Orders struct {
	Prime string
	Order struct {
		TotalPrice string
		Trips      []Orders_trips
		Contact    struct {
			Name  string
			Email string
			Phone string
		}
	}
}

type Orders_trips struct {
	Attraction struct {
		Id      string
		Name    string
		Address string
		Image   string
		Price   string
	}
	Date  string
	Price string
	Time  string
}

type Payment struct {
	Payment_id    int
	Order_number  string
	Uuid          string
	Total_price   int
	Contact_name  string
	Contact_email string
	Contact_phone string
	Status        bool
}

type GetPayment struct {
	Payment_id    int
	Order_number  string
	Uuid          string
	Total_price   int
	Contact_name  string
	Contact_email string
	Contact_phone string
	Status        bool
	Time          string
}

type Trips struct {
	Tid                int
	Trip_order_number  string
	Attraction_id      string
	Attraction_name    string `json:"attraction_name"`
	Attraction_address string `json:"attraction_address"`
	Attraction_image   string `json:"attraction_image"`
	Attraction_price   int    `json:"attraction_price"`
	Attraction_date    string `json:"attraction_date"`
	Attraction_time    string `json:"attraction_time"`
}

type History struct {
	OrderNumber  string  `json:"orderNumber"`
	TotalPrice   int     `json:"totalPrice"`
	ContactName  string  `json:"contactName"`
	ContactEmail string  `json:"contactEmail"`
	ContactPhone string  `json:"contactPhone"`
	Trips        []Trips `json:"trips"`
	Time         string  `json:"time"`
}
