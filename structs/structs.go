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
	Uid      int
	Name     string
	Email    string
	Password string
}
