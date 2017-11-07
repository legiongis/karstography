from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from datetime import datetime
from cspkarst.models import Sink
import csv

class Command(BaseCommand):
    help = 'summarizes the sink categories'

    def add_arguments(self, parser):
        parser.add_argument('outfile',help='specify the output location for the summary')

    def handle(self, *args, **options):
        self.summarize(options['outfile'])

        
    def summarize(self,outfile):
        
        print "creating summary of sinks here:"
        print "  --",outfile
        
        with open(outfile,"w") as out:
            out.write("Summary of Karst Sink\n")
            out.write(" -- {}\n\n".format(datetime.today().strftime("%m-%d-%y")))

        depth_cats = dict(Sink._meta.get_field('depth_cat').choices)
        ordered_dep = depth_cats.keys()
        ordered_dep.sort()
        sink_types = dict(Sink._meta.get_field('sink_type').choices)
        ordered_st = sink_types.keys()
        ordered_st.sort()
        
        # summary_dict = {}
        with open(outfile,'a') as out:
            for d in ordered_dep:
                if d == "0-1":
                    continue
                out.write(depth_cats[d]+"\n")
                total = Sink.objects.filter(depth_cat=d,in_nfhl="f",in_row="f")
                total_l = len(total)
                undone = total.filter(sink_type="",depth_cat=d)
                undone_l = len(undone)
                out.write("  Classification Progress: {} of {} ({})\n".format(total_l-undone_l,total_l,undone_l))
                for s in ordered_st:
                    
                    if s == "SINKHOLE":
                        title = "Sinkhole - Probable"
                        probable = len(total.filter(sink_type=s,confidence="PROBABLE"))
                        filler_len = 50-(len(title)+len(str(probable)))
                        out.write("  {}{}{}\n".format(title,"."*filler_len,probable))
                        
                        title = "Sinkhole - Probable"
                        possible = len(total.filter(sink_type=s,confidence="POSSIBLE"))
                        filler_len = 50-(len(title)+len(str(possible)))
                        out.write("  {}{}{}\n".format(title,"."*filler_len,possible))
                        
                    else:
                        ct = len(total.filter(sink_type=s))
                        filler_len = 50-(len(sink_types[s])+len(str(ct)))
                        out.write("  {}{}{}\n".format(sink_types[s],"."*filler_len,ct))
                        
                        # summary_dict[d][s] = len(total)
        
        # 
        # 

        # with open(outfile,'a') as out:
            
            # csvout.writerow(['depth category','sink type','count'])
            # for d in ordered_dep:
                # for s in ordered_st:
                    # d_label = depth_cats[d]
                    # try:
                        # st_label = sink_types[s]
                    # except:
                        # st_label = s
                    # count = summary_dict[d][s]
                    # row = [d_label,st_label,count]
                    # csvout.writerow(row)
                    
                    

        # print("done")
