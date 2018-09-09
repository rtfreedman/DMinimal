package util

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

func ReadJSONRequestBody(r *http.Request, v *interface{}) error {
	requestContent, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	json.Unmarshal(requestContent, *v)
}
