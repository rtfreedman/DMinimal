
import time
import json
from selenium import webdriver

browser = webdriver.Chrome()
url = ''  # fill in url here
browser.get(url)
time.sleep(10)
cont = input('Continue?')
openers = browser.find_elements_by_css_selector('.dropdown-toggle')[1:-1]
for opener in openers:
    if opener.is_displayed() and opener.text == '':
        time.sleep(0.4)
        opener.click()
bodies = browser.find_elements_by_css_selector('.body')
content = []
for body in bodies:
    try:
        lines = body.text.split('\n')
        name = lines[0]
        levelstuff = lines[1]
        level = levelstuff[0]
        if level not in [str(i) for i in range(1, 10)]:
            level = '0'
        school = levelstuff.split()[-1]
        entry = {}
        entry["Name"] = name
        entry["Level"] = int(level.strip())
        entry["School"] = school.strip()
        for line in lines[2:]:
            pair = line.split(':')
            if len(pair) == 1 or len(pair[0].split()) > 3:
                if "Description" in entry:
                    entry["Description"] += '\n' + pair[0].strip()
                else:
                    entry["Description"] = pair[0].strip()
                continue
            if len(pair) < 1:
                continue
            if pair[0] == "Classes":
                pair[1] = ''.join(pair[1].split()).split(',')
            else:
                pair[1] = pair[1].strip()
            entry[pair[0]] = pair[1]
        content.append(entry)
    except Exception as e:
        print(e)
        pass
with open("data.json", "w") as f:
    json.dump({"Spells": content}, f)
browser.quit()
