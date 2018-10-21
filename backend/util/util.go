package util

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// ReadJSONRequestBody reads a http Request body and attempts to unmarshal it the object at v
func ReadJSONRequestBody(r *http.Request, v interface{}) error {
	requestContent, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	return json.Unmarshal(requestContent, v)
}

// WriteError writes an error back to responsewriter
func WriteError(trace string, w http.ResponseWriter) {
	w.WriteHeader(http.StatusBadRequest)
	w.Write([]byte(trace))
}

// WriteJSONResponse writes a response to the response writer and sets the header as json
func WriteJSONResponse(trace string, resp interface{}, w http.ResponseWriter) {
	bytes, err := json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusExpectationFailed)
		w.Write([]byte("Failure to marshal response interface on action : " + trace))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(bytes)
}

// TransformToMapSlice transforms a slice to a []map[string]type with each element being {$index : value}
func TransformToMapSlice(s []int) map[int]int {
	ret := map[int]int{}
	for index, value := range s {
		ret[index+1] = value
	}
	return ret
}

// AddIntSlices adds two int slices and returns the result
func AddIntSlices(a []int, b []int) (ret []int) {
	if len(a) < len(b) {
		c := b
		b = a
		a = c
	}
	for i := range a {
		if i < len(b) {
			ret = append(ret, a[i]+b[i])
		} else {
			ret = append(ret, a[i])
		}
	}
	return
}
