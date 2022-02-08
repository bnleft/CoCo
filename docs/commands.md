# Commands

Prefix `coco-`

## The `help` command
_Access: everyone_

__No arguments__
> coco-help

Displays all commands

__info__
> coco-help info

Display info command

__stonks__
> coco-help stonks

Display stonks command

__reaction-role__
> coco-help reaction-role

Display reaction-role command

## The `info` command

_Access: wizard_

__No arguments__
> coco-info

Does nothing

__rules__
> coco-info rules

Sends/Edits message in #rules

__officers__
> coco-info officers

Sends/Edits message in #officers

__socials__
> coco-info socials

Sends/Edits message in #socials

## The `stonks` command
_Access: everyone_

__No arguments__
> coco-stonks

Does nothing

__any__
> coco-stonks GME

Displays picture of stonks with text

## The `reaction-role` command

_Access: Wizard_

__Usage / Help Message__

```
coco-reaction-role #channel-mention
Now you can type whatever you want here
Any line that has a role @Mention and an :emoji:
will become a reaction assignable role.
if you have multiple roles you want to be assignable
make sure each @Role and :emoji: are on separate lines.
you can also have the bot create roles that do not yet exist for you
by using <@My New Cool Role Name> or course with an :emoji: on the same line
And here is the exact regex used if you're curious.
^.*<@(?:&(\d+)|([^\n:<>@&]+))>.*?((?:<a?)?:[^\n: ]+:(?:\d+>)?|(?:\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]))
Final thing, at least one reaction role is required.
```

## The `profile` command

_Access: everyone_

__No arguments__
> coco-profile

Display the profile of the message's author

__Mention__
> coco-profile @LeftAutomated

Display the profile of the mentioned user

## The `points` command

_Access: everyone_

__No arguments__
> coco-points

Display how to use this command

__me__
> coco-points me

Display your member points

__lb__
> coco-points lb

Display leaderboard
