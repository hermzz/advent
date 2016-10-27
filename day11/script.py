#!/usr/bin/env python3

# abcdefgh => abcdffaa
# ghijklmn => ghjaabcc
current_passwords = ["abcdefgh", "ghijklmn", "vzbxkghb", "vzbxxyzz"]

# ord('a') => 97
# ord('z') => 122
def increment_password(current_password):
    new_password = list(current_password)
    carry_over = True
    position = len(current_password) - 1

    while carry_over and position > -1:
        new_char = ord(current_password[position]) + 1

        if new_char > 122:
            new_char = 97
            carry_over = True
        else:
            carry_over = False

        new_password[position] = chr(new_char)
        position -= 1

    # If we find that our password contains forbidden characters
    # Just increment the forbidden character by 1 to skip it, 
    # and reset the rest of the password to "a"'s
    for i in ['i', 'o', 'l']:
        if i in new_password:
            position = new_password.index(i)
            new_password = new_password[:position] + [chr(ord(new_password[position])+1)] + ['a' * (len(new_password) - position - 1)]

    return ''.join(new_password)

def check_valid_password(password):
    return has_straight(password) and has_two_pairs(password)

def has_straight(password):
    for i in range(0, len(password) - 2):
        current_ord = ord(password[i])
        if (ord(password[i + 1]) == current_ord + 1) and (ord(password[i + 2]) == current_ord + 2):
            return True

    return False

def has_two_pairs(password):
    pairs = []

    i = 0
    while i < len(password) - 1:
        if ord(password[i]) == ord(password[i + 1]):
            pairs += [password[i]]
            i += 2
        else:
            i += 1

    return len(pairs) >= 2 and any([i != pairs[0] for i in pairs])

def generate_new_password(current_password):
    new_password = current_password
    valid = False
    while not valid:
        new_password = increment_password(new_password)
        valid = check_valid_password(new_password)

    return new_password

for current_password in current_passwords:
    print("Current password: %s" % current_password)
    new_password = generate_new_password(current_password)
    print("New password:     %s\n" % (new_password))